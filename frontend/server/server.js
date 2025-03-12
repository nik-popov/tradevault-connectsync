import 'dotenv/config';
import 'config';
import config from 'config';
import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: 'https://laughing-telegram-4jjjw7wp9gxrc7v5v-5173.app.github.dev',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

const s3Client = new S3Client({
  endpoint: config.get('SPACES_ENDPOINT'),
  region: config.get('REGION'),
  credentials: {
    accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submitImage', upload.single('fileUploadImage'), async (req, res) => {
  try {
    console.log('Received request at /submitImage');
    console.log('Form data:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file uploaded');

    const { imageColumnImage, searchColImage, brandColImage, ColorColImage, CategoryColImage, sendToEmail } = req.body;
    const file = req.file;

    if (!file || !imageColumnImage || !searchColImage || !brandColImage) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const fileName = `${uuidv4().slice(0, 8)}-${file.originalname}`.replace(/\s/g, '');
    const uploadParams = {
      Bucket: config.get('SPACES_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://${config.get('SPACES_BUCKET_NAME')}.s3.${config.get('REGION')}.amazonaws.com/${fileName}`;
    console.log('File uploaded to S3:', fileUrl);

    const midApiData = {
      filePath: fileUrl,
      imageColumnImage,
      searchColImage,
      brandColImage,
      ColorColImage,
      CategoryColImage,
      sendToEmail,
      file_id: fileName, // Optional: align with file_id if needed
    };

    console.log('Sending to MID_API_SERVICE_URL:', midApiData);

    const midApiResponse = await fetch(config.get('MID_API_SERVICE_URL'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(midApiData),
    });

    if (!midApiResponse.ok) {
      const errorText = await midApiResponse.text();
      console.error('MID API error response:', errorText);
      throw new Error(`MID API failed: ${midApiResponse.status} - ${errorText}`);
    }

    const midApiResult = await midApiResponse.json();
    console.log('MID API response:', midApiResult);

    res.json({ success: true, fileUrl, message: 'File uploaded and processed successfully.' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
});

const port = config.get('PORT') || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));