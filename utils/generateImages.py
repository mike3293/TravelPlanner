from PIL import Image, ImageDraw, ImageFont

def generate_number_image(text, fileName, font_path="arialbd.ttf", size=(44, 44), font_size=20, border_width=4):
    # Create an image with transparency and a slightly larger size for padding
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Calculate the center and radius for the circles with a small padding
    padding = 2
    center = (size[0] // 2, size[1] // 2)
    outer_radius = min(size[0], size[1]) // 2 - padding
    inner_radius = outer_radius - border_width

    # Draw the outer white circle (border)
    d.ellipse([center[0] - outer_radius, center[1] - outer_radius, center[0] + outer_radius, center[1] + outer_radius], fill=(255, 255, 255))

    # Draw the inner purple circle
    d.ellipse([center[0] - inner_radius, center[1] - inner_radius, center[0] + inner_radius, center[1] + inner_radius], fill=(154, 119, 230))

    # Load the bold font
    font = ImageFont.truetype(font_path, font_size)

    # Get the bounding box of the text
    text_bbox = d.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]

    # Calculate position for center alignment
    position = ((size[0] - text_width) / 2, (size[1] - text_height) / 2 * 0.75)

    # Add the number to the image with white color
    d.text(position, text, font=font, fill=(255, 255, 255))  # White text

    # Save the image
    img.save(f'images/{fileName}.png')

# Generate images for numbers 1 to 100
for i in range(1, 100):
    generate_number_image(str(i), f'number-{i}')

generate_number_image('', 'empty')
