const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PASSWORDS_TABLE;

// CORS headers 
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Helper function to create response and other stuff
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

// Helper function to handle annoying errors 
const handleError = (error, message = 'Internal server error') => {
  console.error('Error:', error);

  return createResponse(500, { error: message });
};

// Helper function to normalize website URL and make the world better
const normalizeWebsite = (website) => {
  if (!website) return website;
  
  // If it doesn't start with http:// or https://, add https://
  if (!website.startsWith('http://') && !website.startsWith('https://')) {

    return `https://${website}`;
  }
  
  return website;
};

// Create a new password
exports.createPassword = async (event) => {
  try {
    const { website, username, password } = JSON.parse(event.body || '{}');
    
    // Validate require fields
    if (!website || !username || !password) {
      return createResponse(400, { 
        error: 'Missing required fields: website, username or password' 
      });
    }

    // Normalise website URL
    const normalizedWebsite = normalizeWebsite(website);

    // Check if a password already exists for the website + username combination - double check, not sure this works
    const scanParams = {
      TableName: tableName,
      FilterExpression: 'website = :website AND username = :username',
      ExpressionAttributeValues: {
        ':website': normalizedWebsite,
        ':username': username
      }
    };

    const existingPasswords = await dynamodb.scan(scanParams).promise();
    
    if (existingPasswords.Items && existingPasswords.Items.length > 0) {
      return createResponse(409, { 
        error: 'A password already exists for this website and username combination' 
      });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const params = {
      TableName: tableName,
      Item: {
        id,
        website: normalizedWebsite,
        username,
        password,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    await dynamodb.put(params).promise();

    return createResponse(201, {
      message: 'Password created successfully',
      id,
      website: normalizedWebsite,
      username
    });

  } catch (error) {
    return handleError(error, 'Failed to create password');
  }
};

// All your passwords are belong to us
exports.getPasswords = async (event) => {
  try {
    const params = {
      TableName: tableName
    };

    const result = await dynamodb.scan(params).promise();

    // Remove password field from response
    const passwords = result.Items.map(item => ({
      id: item.id,

      website: item.website,
      username: item.username,
      password: item.password, 
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return createResponse(200, { passwords });

  } catch (error) {
    return handleError(error, 'Failed to retrieve passwords');
  }
};

// Update an existing password
exports.updatePassword = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { website, username, password } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!website || !username || !password) {
      return createResponse(400, { 
        error: 'Missing required fields: website, username or password' 
      });
    }

    // Normalize website URL
    const normalizedWebsite = normalizeWebsite(website);

    // First check if the password exists
    const getParams = {
      TableName: tableName,
      Key: { id }
    };

    const existingItem = await dynamodb.get(getParams).promise();

    if (!existingItem.Item) {
      return createResponse(404, { 
        error: 'Password not found' 
      });
    }

    // Check if another password already exists for this website and username combination
    // (excluding the current password being updated) - double check this too, i think i already have code that handles this
    const scanParams = {
      TableName: tableName,
      FilterExpression: 'website = :website AND username = :username AND id <> :currentId',
      ExpressionAttributeValues: {
        ':website': normalizedWebsite,
        ':username': username,
        ':currentId': id
      }
    };

    const duplicatePasswords = await dynamodb.scan(scanParams).promise();
    
    if (duplicatePasswords.Items && duplicatePasswords.Items.length > 0) {
      return createResponse(409, { 
        error: 'A password already exists for this website and username combination' 
      });
    }

    // Update Thy password mortal
    const updateParams = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: 'SET website = :website, username = :username, password = :password, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':website': normalizedWebsite,
        ':username': username,
        ':password': password,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(updateParams).promise();

    return createResponse(200, {
      message: 'Password updated successfully',
      password: {
        id: result.Attributes.id,
        website: result.Attributes.website,
        username: result.Attributes.username,
        password: result.Attributes.password,
        createdAt: result.Attributes.createdAt,
        updatedAt: result.Attributes.updatedAt
      }
    });

  } catch (error) {
    return handleError(error, 'Failed to update password');
  }
};

// Delete a password
exports.deletePassword = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: tableName,
      Key: { id }
    };

    await dynamodb.delete(params).promise();

    return createResponse(200, {
      message: 'Password deleted successfully',
      id
    });

  } catch (error) {
    return handleError(error, 'Failed to delete password');
  }
};
