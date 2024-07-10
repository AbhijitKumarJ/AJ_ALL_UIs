from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
import io
from PIL import Image
import torch
from transformers import AutoFeatureExtractor, AutoModelForImageClassification, VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer

router = APIRouter()

# Initialize models
image_classifier = AutoModelForImageClassification.from_pretrained("microsoft/resnet-50")
feature_extractor = AutoFeatureExtractor.from_pretrained("microsoft/resnet-50")

image_captioner = VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
image_processor = ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")

class ImageToTextOutput(BaseModel):
    caption: str

@router.post("/classify", response_model=dict)
async def classify_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image")
    
    image = Image.open(io.BytesIO(await file.read()))
    inputs = feature_extractor(images=image, return_tensors="pt")
    outputs = image_classifier(**inputs)
    probs = outputs.logits.softmax(1)
    labels = {i: image_classifier.config.id2label[i] for i in range(len(image_classifier.config.id2label))}
    
    return {labels[i.item()]: prob.item() for i, prob in enumerate(probs[0].sort(descending=True)[0][:5])}

@router.post("/caption", response_model=ImageToTextOutput)
async def caption_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image")
    
    image = Image.open(io.BytesIO(await file.read()))
    pixel_values = image_processor(images=image, return_tensors="pt").pixel_values
    
    with torch.no_grad():
        output_ids = image_captioner.generate(pixel_values, max_length=16, num_beams=4)
    
    caption = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return ImageToTextOutput(caption=caption)
