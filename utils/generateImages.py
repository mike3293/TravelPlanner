import os
from PIL import Image, ImageDraw, ImageFont

colors = {
    'purple': (154, 119, 230),
    'amber': (255, 145, 0),
    'teal': (0, 150, 136),
    'green': (124, 179, 66),
    'indigo': (92, 107, 192)
}

def generate_number_image(text, fileName, folder, circle_color, font_path="arialbd.ttf", size=(44, 44), font_size=20, border_width=4):
    # Create the subfolder if it doesn't exist
    if not os.path.exists(folder):
        os.makedirs(folder)

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

    # Draw the inner colored circle
    d.ellipse([center[0] - inner_radius, center[1] - inner_radius, center[0] + inner_radius, center[1] + inner_radius], fill=circle_color)

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

    # Save the image in the specified folder
    img.save(f'{folder}/{fileName}.png')


# Generate images for numbers 1 to 100 in 4 different color folders
for color_name, color_value in colors.items():
    for i in range(1, 100):
        generate_number_image(str(i), f'number-{i}', folder=f'images/{color_name}', circle_color=color_value)

# Generate an empty image for each color folder
for color_name, color_value in colors.items():
    generate_number_image('', 'empty', folder=f'images/{color_name}', circle_color=color_value)
