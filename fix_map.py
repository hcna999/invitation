import os
from PIL import Image, ImageDraw

def fix_image():
    base_dir = r"c:\Users\skgkr\Documents\Project\청첩장"
    img_path = os.path.join(base_dir, "지도", "ladomus_map", "라도무스약도_수정.jpg")
    
    if not os.path.exists(img_path):
        print("Image not found at:", img_path)
        return
        
    img = Image.open(img_path)
    draw = ImageDraw.Draw(img)
    
    width, height = img.size
    
    # Sample background color from the red bubble (safe spot above the text)
    sample_x = int(width * 0.55)
    sample_y = int(height * 0.10)
    bg_color = img.getpixel((sample_x, sample_y))
    
    # Coordinates to cover the bottom text
    # text is around 15% to 24% height, 47% to 74% width
    box_x0 = int(width * 0.46)
    box_y0 = int(height * 0.155)
    box_x1 = int(width * 0.74)
    box_y1 = int(height * 0.245)
    
    draw.rectangle([box_x0, box_y0, box_x1, box_y1], fill=bg_color)
    
    # Save over the original
    img.save(img_path, quality=95)
    print("Image fixed and saved successfully!")

if __name__ == "__main__":
    fix_image()
