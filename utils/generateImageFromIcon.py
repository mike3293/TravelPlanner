import os
from PIL import Image, ImageDraw, ImageFont

colors = {
    'red': (255, 112, 67),
}

def generate_icon_image(icon_path, fileName, folder, circle_color, size=(44, 44), border_width=4):
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

    # Load and resize the icon image
    icon = Image.open(icon_path).convert("RGBA")
    icon.thumbnail((inner_radius * 2, inner_radius * 2), Image.LANCZOS)  # Resize icon to fit within inner circle

    # Calculate position for center alignment
    icon_position = ((center[0] - icon.width // 2) + 1, center[1] - icon.height // 2)

    # Paste the icon onto the image
    img.paste(icon, icon_position, icon)  # Use the icon's own alpha channel as a mask

    # Save the image in the specified folder
    img.save(f'{folder}/{fileName}.png')

# Path to the bed or building icon
icon_path = "bed.png"  # Replace with your icon file path (e.g., "building.png")

# Generate icon images in each color folder
for color_name, color_value in colors.items():
    generate_icon_image(icon_path, 'icon', folder=f'images/bed/{color_name}', circle_color=color_value)
