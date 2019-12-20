from PIL import Image
from io import BytesIO
import numpy as np
import base64
import pytesseract
import argparse

def ocr_core(file, type):
	if type == 'base64':
		img = file.split(',')[1]
		imgBase64Decode = base64.b64decode(img)
		imgToOpen = BytesIO(imgBase64Decode)
	else:
		imgToOpen = file

	imgPIL = Image.open(imgToOpen)
	text = pytesseract.image_to_string(imgPIL)
	return text

if __name__ == '__main__':
	ap = argparse.ArgumentParser()
	ap.add_argument("-b64", "--base64", required=False, help="Image by base64 encoded")
	ap.add_argument("-p", "--path", required=False, help="Image by filepath")
	args = vars(ap.parse_args())

	if (args["base64"] is not None):
		textByML = ocr_core(args["base64"], 'base64')
	else:
		textByML = ocr_core(args["path"], 'path')

	print(textByML)