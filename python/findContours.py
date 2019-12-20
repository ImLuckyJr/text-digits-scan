import cv2
import numpy as np
import os
import uuid 

# hsv_min = np.array((54, 55, 0), np.uint8)
# hsv_max = np.array((255, 255, 116), np.uint8)
hsv_min = np.array((90, 12, 0), np.uint8)
hsv_max = np.array((183, 255, 255), np.uint8)

image_file = "E:\\Projects\\JS\\digitsScanBot\\python\\images\\digits.jpg"
# image_file = "E:\\Projects\\JS\\digitsScanBot\\python\\images\\digits.png"
img = cv2.imread(image_file)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
hsv = cv2.cvtColor( img, cv2.COLOR_BGR2HSV ) # меняем цветовую модель с BGR на HSV 
thresh = cv2.inRange( hsv, hsv_min, hsv_max ) # применяем цветовой фильтр


# ret, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY)

erode1 = cv2.dilate(thresh, np.ones((2, 2), np.uint8), iterations=1)
# erode2 = cv2.erode(gray, np.ones((2, 2), np.uint8), iterations=1)

# Get contours
contours1, hierarchy1 = cv2.findContours(erode1, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

# contours2, hierarchy2 = cv2.findContours(erode2, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

output = img.copy()

out_size=28
letters = []
for idx, contour1 in enumerate(contours1):
	(x, y, w, h) = cv2.boundingRect(contour1)
	# print("x-{0} y-{1} w-{2} h-{3}".format(x, y, w, h))
	# print(hierarchy1[0][idx][3])
	# if hierarchy1[0][idx][3] == 0:
	cv2.rectangle(output, (x, y), (x + w, y + h), (0, 0, 255), 1)

	letter_crop = gray[y:y + h, x:x + w]
	# print(letter_crop.shape)

	# Resize letter canvas to square
	size_max = max(w, h)
	letter_square = 255 * np.ones(shape=[size_max, size_max], dtype=np.uint8)
	if w > h:
		# Enlarge image top-bottom
		# ------
		# ======
		# ------
		y_pos = size_max//2 - h//2
		letter_square[y_pos:y_pos + h, 0:w] = letter_crop
	elif w < h:
		# Enlarge image left-right
		# --||--
		x_pos = size_max//2 - w//2
		letter_square[0:h, x_pos:x_pos + w] = letter_crop
	else:
		letter_square = letter_crop

	# Resize letter to 28x28 and add letter and its X-coordinate
	letters.append((x, w, cv2.resize(letter_square, (out_size, out_size), interpolation=cv2.INTER_AREA)))


letters = letters[::-1]

path = 'E:\\Projects\\JS\\digitsScanBot\\python\\images\\crop\\{0}'.format(uuid.uuid1())
for idx in range(len(letters)):
	# print(letters[idx][0])

	if not os.path.exists(path):
		os.mkdir(path)

	cv2.imwrite(os.path.join(path , "digit-{0}.jpg".format(idx)), letters[idx][2])

# for idx, contour2 in enumerate(contours2):
# 	(x, y, w, h) = cv2.boundingRect(contour2)
# 	if hierarchy2[0][idx][3] == 0:
# 		cv2.rectangle(output, (x, y), (x + w, y + h), (0, 70, 0), 2)

# cv2.imshow("img", img)
# cv2.imshow("erode1", erode1)
# cv2.imshow("erode2", erode2)
# cv2.imshow("Output", output)
# cv2.imshow("0", letters[0][2])
# cv2.imshow("1", letters[1][2])
# cv2.imshow("2", letters[2][2])
# cv2.imshow("3", letters[3][2])
# cv2.imshow("4", letters[4][2])
cv2.waitKey(0)	






	# img = cv2.imread(filename)
	# hsv_min = np.array((88, 47, 0), np.uint8)
	# hsv_max = np.array((255, 255, 154), np.uint8)
	# hsv = cv2.cvtColor( img, cv2.COLOR_BGR2HSV )
	# thresh = cv2.inRange(hsv, hsv_min, hsv_max)
	# thresh = cv2.bitwise_not(thresh)

	"""
	This function will handle the core OCR processing of images.
	"""
	# text = pytesseract.image_to_string(thresh)
	# text = pytesseract.image_to_string(Image.open(filename))