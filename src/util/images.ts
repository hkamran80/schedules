export const icon = (icon: string, newSize = 16) =>
    icon.replace(
        'width="24" height="24"',
        `width="${newSize}" height="${newSize}"`,
    );
