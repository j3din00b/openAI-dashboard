import { format, addDays, startOfMonth, parse } from 'date-fns'

// types
// ## COST TOTAL
export interface LineItemsEntity {
  name: string;
  cost: number;
}
export interface DailyCostsEntity {
  timestamp: number;
  line_items: LineItemsEntity[];
  mes?: string;
}
export interface dataDash {
  object: string;
  daily_costs: DailyCostsEntity[] ;
  total_usage: number;
}


// BILLING
export interface Plan {
  title: string;
  id: string;
}
export interface BillingAddress {
  city: string;
  line1: string;
  line2?: null;
  state: string;
  country: string;
  postal_code: string;
}

export interface Billing {
  object: string;
  has_payment_method: boolean;
  canceled: boolean;
  canceled_at?: null;
  delinquent?: null;
  access_until: number;
  soft_limit: number;
  hard_limit: number;
  system_hard_limit: number;
  soft_limit_usd: number;
  hard_limit_usd: number;
  system_hard_limit_usd: number;
  plan: Plan;
  account_name?: null;
  po_number?: null;
  billing_email?: null;
  tax_ids?: null;
  billing_address: BillingAddress;
  business_address?: null;
}

// tokens / requests
export interface DataEntity {
  aggregation_timestamp: number;
  n_requests: number;
  operation: string;
  snapshot_id: string;
  n_context: number;
  n_context_tokens_total: number;
  n_generated: number;
  n_generated_tokens_total: number;
}
export interface Value {
  object: string;
  data?: (DataEntity)[] | null;
  ft_data?: (null)[] | null;
  dalle_api_data?: (null)[] | null;
  whisper_api_data?: (null)[] | null;
  current_usage_usd: number;
}
export interface tokensRequests {
  status: string;
  value: Value;
}









export interface tokens {
  object: string;
  data?: (DataEntity)[] | null;
  ft_data?: (null)[] | null;
  dalle_api_data?: (null)[] | null;
  whisper_api_data?: (WhisperApiDataEntity)[] | null;
  tts_api_data?: (null)[] | null;
  assistant_code_interpreter_data?: (null)[] | null;
}
export interface DataEntity {
  organization_id: string;
  organization_name: string;
  aggregation_timestamp: number;
  n_requests: number;
  operation: string;
  snapshot_id: string;
  n_context_tokens_total: number;
  n_generated_tokens_total: number;
  email: string;
  api_key_id: string;
  api_key_name: string;
  api_key_redacted: string;
}
export interface WhisperApiDataEntity {
  timestamp: number;
  model_id: string;
  num_seconds: number;
  num_requests: number;
  user_id: string;
  organization_id: string;
  api_key_id: string;
  api_key_name: string;
  api_key_redacted: string;
  organization_name: string;
}


// URLs used
const URLAPIKEYS            = `https://api.openai.com/dashboard/user/api_keys`
const URLUSAGE              = `https://api.openai.com/dashboard/billing/usage`
const URLLIMITS             = 'https://api.openai.com/dashboard/billing/subscription'
const URLREQUESTSANDTOKENS  = 'https://api.openai.com/v1/dashboard/activity'
// const URLREQUESTSANDTOKENS  = 'https://api.openai.com/v1/usage?date='

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DATEFORMATE = 'yyyy-MM-dd'

const TOTALKEYSFOUNDED = Object.keys(process.env).filter(e => e.startsWith("OPENAI_API_SESS_"))
const TOKENS:Array<string> = process.env.OPENAI_API_SESS ? [process.env.OPENAI_API_SESS ] : []

for (let i = 1; i <= TOTALKEYSFOUNDED.length + 1; i++) {
  const token = process.env[`OPENAI_API_SESS_${i}`];
  if (token) {
     TOKENS.push(token);
  }
}

async function makeFetchv2(url="", key="") {
  
  const res = await fetch(url, {
    headers: {
      'Host': 'api.openai.com',
      'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.5',
      'referer': 'https://platform.openai.com/',
      'authorization': 'Bearer '+key,
      'origin': 'https://platform.openai.com',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'te': 'trailers'
    }
  });

  const data = await res?.json()
  return data
}

async function makeFetch(url="", key=""){

  const response = await fetch(url, 
    {
      mode: "no-cors",
      headers:{
        "Content-Type": "application/json",
        "Origin": "https://platform.openai.com",
        "Referer": "https://platform.openai.com/",
        'Authorization': `Bearer ${key}`,
      },
      referrerPolicy: "no-referrer",
    }).then(resp => {
      if(resp.status != 200){
        console.log(url + " Erro >>>>>>> ", resp?.status, " ---- ", resp?.statusText)
      }
    if(resp.ok){
      // console.log(url+"11111111", resp)
      return resp.json()
    }
    throw Error()

  }).catch(err => {
    console.error(err)
    return []
  })
  return response
}

// async function getApiKeys(key){
//   const resp = await makeFetch(URLAPIKEYS, key)
//   if(resp.data){
//     return resp.data
//   }
//   return []
// }

// const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getTokensTotal(key:string, start:string, end:string):Promise<tokens>{
  const urlFinal = URLREQUESTSANDTOKENS+`?start_date=${start}&end_date=${end}`
  const resp = await makeFetchv2(urlFinal, key)
  return resp
}

async function getTokensRequests(key:string, ){
  // const tokensDay = Array.from({length: new Date().getDate() + 1}, (_, i) => i + 1)
  // let requestTokens = []
  // console.log("fetch len >$", tokensDay.length)


  // const currentDay = new Date()
  // currentDay.setDate(day)
  // requestTokens.push(makeFetch(`${URLREQUESTSANDTOKENS}${format(currentDay, DATEFORMATE)}`, key))

  // for(const day of tokensDay){
  //   // await sleep(500)
  // }

  return await Promise.allSettled(requestTokens)
}

async function getLimitUser(key:string){
  const resp = await makeFetch(URLLIMITS, key)
  return resp
}

// #
async function getCustoTotal(key:string, start:string, end:string):Promise<dataDash>{
  const urlFinal = URLUSAGE+`?start_date=${start}&end_date=${end}`
  const resp = await makeFetch(urlFinal, key)
  return resp
}

export interface costsProps {
  timestamp: number
  label: string
  sum: number
  items: {name: string, cost: number}[]
}
export interface Costs {
  costsList: costsProps[]
  totalUsage: number
  totalUsageFormatted: string
  modelsName: string[]
}

function formatCosts(arrayCosts:DailyCostsEntity[]):costsProps[]{
  if(!arrayCosts) return []

  const resp = arrayCosts.map(cost => {
    if(!cost) return ({label: "erro", items:[], timestamp: "", sum: 0})
    const toDate = new Date(cost.timestamp * 1000);
    const finalCost:costsProps = {
      label: monthNames[toDate.getMonth()] + " " + toDate.getDate(),
      items: cost.line_items,
      timestamp: cost.timestamp,
      sum: cost.line_items.reduce((acc, cur) => acc + cur.cost, 0)
    }
    return finalCost
  })
  return resp
}


// GET
const itemsNameCache = new Set()
class OpenAiAnalytics {
  keySelect
  totalkeys
  keyName: Array<any>
  apiKey
  costsItems: Costs | null
  showModels: Array<string>
  costsStartDate
  costsEndDate
  costsEndDateType
  costsStartdDateType
  filterModels: Array<string> | null
  tokensAndRequests: Array<any> | null
  limites: Array<any> | null
  constructor(session?:string, token:string){
     this.apiKey              = token ?? process.env.OPENAI_API_KEY
     this.keySelect           = session ?? process.env.OPENAI_API_SESS
     this.totalkeys           = TOTALKEYSFOUNDED
     this.keyName             = []
     this.costsItems          = null
     this.showModels          = []
     this.costsStartDate      = format(startOfMonth(new Date), DATEFORMATE)
     this.costsEndDate        = format(addDays(new Date(), 1), DATEFORMATE)
     this.costsEndDateType    = startOfMonth(new Date)
     this.costsStartdDateType = addDays(new Date(), 1)
     this.filterModels        = null
     this.tokensAndRequests   = null
     this.limites             = null
    }
    async update(key=this.keySelect){
      if(this.keySelect){
        const tokens = await getTokensTotal(this.keySelect, this.costsStartDate, this.costsEndDate)
        this.tokensAndRequests = tokens
      }
      const limits = await getLimitUser(key)

      this.limites = limits
    }

    async selectKey(key:string){
    this.keySelect = key
    await this.update(key)
  }
  listKeys(){
    return TOKENS
  }

  setPeriodo(start:string | undefined, end:string | undefined){
    if(!start) return null
    let fixEnd = end
    if(fixEnd == null){
      const data = parse(start, 'yyyy-MM-dd', new Date());
      const plusOne = addDays(data, 1);
      fixEnd = format(plusOne, 'yyyy-MM-dd')
    }
    this.costsStartDate = start
    this.costsEndDate = fixEnd
    this.costsStartdDateType = parse(start, 'yyyy-MM-dd', new Date());
    this.costsEndDateType = parse(fixEnd, 'yyyy-MM-dd', new Date());
  }

  async costs(key:string=this.keySelect, start: string | undefined, end:string | undefined){
    this.setPeriodo(start, end)
    const custoBruto = await getCustoTotal(key, this.costsStartDate, this.costsEndDate)
    // filter by

    // better format costs
    this.costsItems = {
      totalUsageFormatted: ((custoBruto.total_usage ?? 0) / 100).toLocaleString("en-US",{style: "currency", currency: "USD"}),
      totalUsage: custoBruto.total_usage / 100,
      modelsName: custoBruto.daily_costs?.length > 0 ? custoBruto.daily_costs[0].line_items.map(n => n.name) : [],
      costsList: formatCosts(custoBruto.daily_costs),
    }

    return this
  }

  models(filterModels: string[] | null){
    if(!filterModels){
      return this
    }

    return this
  }


}

export const OpenAiWrapper = new OpenAiAnalytics(process.env.OPENAI_API_SESS ?? "", process.env.OPENAI_API_KEY)

async function createAnalyticsInstance(token?:string, start?:string, end?:string) {
  if(token){
    OpenAiWrapper.selectKey(token)
  }
  
  // obs
  await OpenAiWrapper.costs(OpenAiWrapper.keySelect , start, end)
  await OpenAiWrapper.update();
  return OpenAiWrapper
}

export default createAnalyticsInstance