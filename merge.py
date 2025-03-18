from pathlib import Path
from os import path as p
from sys import argv

ignored_files = ['zip', 'md', 'exe']
ignored_folders = ['node_modules', '.git', '.next', 'build', 'dist']

merged = ''

def check_ignored(path):
    ext = p.splitext(path)[1][1:]
    if not p.isfile(path) or p.getsize(path) < 1 or ext in ignored_files:
        return True

    for folder in ignored_folders:
        if folder+'/' in path or folder + '\\' in path or folder + '\\\\' in path:
            return True

    return False

for file in Path(argv[1]).rglob("*"):
    path = str(file.resolve())
    if check_ignored(path):
        continue
    print(path)
    merged += path + '\n\n'
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            if len(content):
                merged += content + '\n'
    except UnicodeDecodeError:
        print(f"Skipping file {path} due to encoding issues.")

try:
    with open('output.txt', 'w', encoding='utf-8') as f:
        f.write(merged)
except Exception as e:
    print(f'Cannot write output: {e}')

print("Done.")

input()