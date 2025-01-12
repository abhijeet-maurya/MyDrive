const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required.');
}

const Supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(fileStream, fileName, bucketName) {
    const uniqueFileName = `${uuidv4()}-${fileName}`;
    const { data, error } = await Supabase
        .storage
        .from(bucketName)
        .upload(uniqueFileName, fileStream, {
            cacheControl: '3600',
            upsert: true,
            unique:true,
        });

    if (error) {
        console.log(error);
    }
    
    return { Key: uniqueFileName ,originalname: fileName};
}

module.exports = { Supabase, uploadFile };