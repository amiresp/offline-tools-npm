# پایه: Node.js پایدار
FROM node:20

# مسیر کاری
WORKDIR /usr/src/app

# فقط package.json و package-lock.json
COPY package*.json ./

# نصب dependencies
RUN npm install

# کپی بقیه سورس
COPY . .

# پورت کانتینر
EXPOSE 2020

# دستور شروع سرور وقتی کانتینر بالا میاد
CMD ["node", "server.js"]
