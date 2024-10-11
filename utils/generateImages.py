from PIL import Image, ImageDraw, ImageFont

def generate_number_image(text, fileName, font_path="arialbd.ttf", size=(40, 40), font_size=20):
    # Create an image with a blue background
    img = Image.new('RGBA', size, (0, 0, 0, 0))  # Beautiful blue
    d = ImageDraw.Draw(img)

    # Draw rounded rectangle
    border_radius = 20
    d.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=border_radius, fill=(154, 119, 230))

    # Load the bold font
    font = ImageFont.truetype(font_path, font_size)
    
    # Get the bounding box of the text
    text_bbox = d.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # Calculate position for center alignment
    position = ((size[0] - text_width) / 2 * 0.95, (size[1] - text_height) / 2 * 0.75)
    
    # Add the number to the image with white color
    d.text(position, text, font=font, fill=(255, 255, 255))  # White text
    # Save the image
    img.save(f'images/{fileName}.png')


# Generate images for numbers 1 to 100
for i in range(1, 100):
    generate_number_image(str(i), f'number-{i}')

generate_number_image('', 'empty')
