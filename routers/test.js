const crypto = require('crypto');

module.exports.getEncryptedText = function(text, key, iv = crypto.randomBytes(16)) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedText: encrypted
    };
};

module.exports.getDecryptedText = function(encryptedText, key, iv) {
    iv = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
