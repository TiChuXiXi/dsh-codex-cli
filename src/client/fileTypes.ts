/** Files that cannot use the workspace document/image viewer. */
export function downloadsOnClick(path:string):boolean {
  return /\.(?:zip|7z|rar|tar|gz|bz2|xz|tgz|tbz2|zst|deb|rpm|exe|msi|apk|dmg|iso|bin|dll|so|dylib|wasm|db|sqlite|sqlite3|pkl|pickle|parquet|feather|npy|npz|mp3|mp4|wav|flac|ogg|webm|mov|avi)$/i.test(path)
}
