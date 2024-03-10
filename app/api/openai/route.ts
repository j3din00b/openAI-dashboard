import { NextResponse } from 'next/server'
import  App, {OpenAiWrapper}  from './WrapperAPI'


export const GET = async (req: Request) => {  
  // const ints = await App()

  return NextResponse.json({
    in: new Date(), 
    sucesso: true,
    OpenAiWrapper:OpenAiWrapper.listKeys()
  })
}
