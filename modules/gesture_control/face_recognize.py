# facerec.py
import cv2, sys, numpy, os
import time
from os import path

HELPER_PATH = path.dirname(path.realpath(__file__))
sys.path.insert(0, HELPER_PATH)

size = 4
haar_file = HELPER_PATH +'/haarcascade_frontalface_default.xml'
datasets = HELPER_PATH +'/datasets'
# Part 1: Create fisherRecognizer
#print('Training...')
#sys.stdout.flush()

# Create a list of images and a list of corresponding names
(images, labels, names, id) = ([], [], {}, 0)
for (subdirs, dirs, files) in os.walk(datasets):
    for subdir in dirs:
        names[id] = subdir
        subjectpath = os.path.join(datasets, subdir)
        for filename in os.listdir(subjectpath):
            path = subjectpath + '/' + filename
            label = id
            images.append(cv2.imread(path, 0))
            labels.append(int(label))
        id += 1
(width, height) = (130, 100)

# Create a Numpy array from the two lists above
(images, labels) = [numpy.array(lis) for lis in [images, labels]]
#print (images,labels)
# OpenCV trains a model from the images
# NOTE FOR OpenCV2: remove '.face'
model = cv2.createLBPHFaceRecognizer()
model.train(images, labels)

# Part 2: Use fisherRecognizer on camera stream
face_cascade = cv2.CascadeClassifier(haar_file)
webcam = cv2.VideoCapture(0)
cv2.namedWindow('OpenCV',cv2.WINDOW_NORMAL)
cv2.resizeWindow('OpenCV', 400,400)
a = time.time()
while True:
    (_, im) = webcam.read()
    im = cv2.flip(im,1)
    gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    for (x,y,w,h) in faces:
        cv2.rectangle(im,(x,y),(x+w,y+h),(255,0,0),2)
        face = gray[y:y + h, x:x + w]
        face_resize = cv2.resize(face, (width, height))
        #Try to recognize the face
        prediction = model.predict(face_resize)
        cv2.rectangle(im, (x, y), (x + w, y + h), (0, 255, 0), 3)

        if prediction[1]<500:
            if(time.time()-a > 60):
                print(names[prediction[0]])
                sys.stdout.flush()
                a = time.time()
            cv2.putText(im,'%s - %.0f' % (names[prediction[0]],prediction[1]),(x-10, y-10), cv2.FONT_HERSHEY_PLAIN,1,(0, 255, 0))
        else:
            cv2.putText(im,'not recognized',(x-10, y-10), cv2.FONT_HERSHEY_PLAIN,1,(0, 255, 0))

    
    cv2.imshow('OpenCV', im)
    key = cv2.waitKey(10)
    if key == 27:
        break
