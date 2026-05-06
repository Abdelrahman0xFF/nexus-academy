@echo off

start cmd /k "stripe listen --forward-to localhost:4000/webhook"
start cmd /k "cd .\backend && npm install && npm start"
start cmd /k "cd .\frontend && npm install && npm run dev"

exit  