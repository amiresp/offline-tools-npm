# پایه: Node.js نسخه پایدار
FROM node:20

# مسیر کاری داخل کانتینر
WORKDIR /usr/src/app

# فقط package*.json رو کپی کن تا npm install cache بشه
COPY package*.json ./

# نصب dependencies
RUN npm install

# بقیه سورس کد رو کپی کن
COPY . .

# پورت اختیاری (برای دسترسی از بیرون)
EXPOSE 3000

# **هیچ CMD یا ENTRYPOINT ای نداریم**
# یعنی کانتینر بدون دستور اجرا، فقط آماده‌ست
