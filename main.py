from fastapi import FastAPI, Form, File, UploadFile
from fastapi.responses import JSONResponse
import os
app = FastAPI()

@app.post("/receive_message")
def receive_message(message: str = Form(...)):
    # 异或解密
    key = 0x000000F0
    decrypted_message = decrypt_message(message, key)

    print(f"Received decrypted message: {decrypted_message}")
    return {"status": "success"}

def decrypt_message(encrypted_message, key):
    decrypted_message = ''
    for char in encrypted_message:
        decrypted_char = chr(ord(char) ^ key)
        decrypted_message += decrypted_char
    return decrypted_message

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    # 保存上传的图片到服务器
    with open(f"images/{file.filename}", "wb") as image_file:
        image_file.write(file.file.read())

    return {"status": "success", "filename": file.filename}
