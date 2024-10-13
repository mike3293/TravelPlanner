export const downloadFile = async (filename: string, file: Blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};