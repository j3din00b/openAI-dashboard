
import { NextResponse } from 'next/server'


const TOKENOPENAI = process.env.OPENAI_BEARER_TOKEN
const URLLOGIN = `https://api.openai.com/dashboard/onboarding/login`
import { cache } from "react"

export const GETCACHED = cache(async () => {
  const userInfo = await fetch(URLLOGIN, { 
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${TOKENOPENAI}`,
    },
    referrerPolicy: "no-referrer",
  }).then(e => e.json())

  console.log(">>>>>>>>", userInfo.user.session.sensitive_id)
if(userInfo.user.session){
  process.env.OPENAI_API_SESS = userInfo.user.session.sensitive_id
}

  return userInfo
})

export const GET = async (req: Request) => {
  // login info
  const userInfo = await fetch(URLLOGIN, { 
   method: "POST",
   mode: "no-cors",
   headers: {
     "Content-Type": "application/json",
     'Authorization': `Bearer ${TOKENOPENAI}`,
   },
   referrerPolicy: "no-referrer",
 }).then(e => e.json())


 console.log(">>>>>>>>", userInfo.user.session.sensitive_id)
if(userInfo.user.session){
  process.env.OPENAI_API_SESS = userInfo.user.session.sensitive_id
}

 return NextResponse.json({
   in: new Date(), 
   sucesso: true,
   user: userInfo
 })
}