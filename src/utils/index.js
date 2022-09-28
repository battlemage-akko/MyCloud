import suffix from "@/utils/dictionary.json"

export const pathFunc = (path, type = 'parent') => {
    switch (type) {
        case 'parent':
            const index = path.lastIndexOf("/");
            return path.substring(0, index + 1);
    }
}

export const checkType = (path) => {
    const index = path.lastIndexOf(".");
    const suffixName = path.substr(index);
    let type = 'other'
    Object.keys(suffix).map((key) => {
        if (suffix[key].indexOf(suffixName) != -1) {
            type = key
        }
    })
    return type
}

export const  bytesToSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}