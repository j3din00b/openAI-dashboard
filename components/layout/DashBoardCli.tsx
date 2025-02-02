"use client";
import React, { useMemo, useState } from "react";
import {
  Metric,
  Grid,
  Card,
  Title,
  DonutChart,
  BarChart,
  Legend,
  Flex,
  Text,
  ProgressBar,
  Toggle,
  ToggleItem,
  AreaChart,
  TabList,
  Tab,
  BarList,
  Color,
} from "@tremor/react";
import {
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";

import { Billing, Costs, tokens, tokensRequests } from "@/app/api/openai/WrapperAPI";


// constantes
const colors: Color[] = ["blue", "amber", "rose", "indigo", "emerald", "pink", "teal"];

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;
const formatoCerto = (data) =>
  Object.entries(data).map(([name, total]) => ({
    name,
    total: Number(total.toLocaleString("en-US", {})),
  }));

const calcporcentage = (total: number, x = 0) =>
  total ? (x * 100) / total : 0;

function calcularTotal(data) {
  const total = data.reduce((acc, obj) => {
    for (const key in obj) {
      if (!["label"].includes(key)) {
        acc[key] = (acc[key] || 0) + obj[key];
      }
    }
    return acc;
  }, {});

  return total;
}

// To use this graph I must add up all the categories
const DonutChartw = ({ data, total, totalSemFormato, billing }:{data: Array<any>, total: string, totalSemFormato: number, billing:Billing}) => {
  // graph total
  const totallll = calcularTotal(data);
  const sumTotal = formatoCerto(totallll);

  // billing
  const hardLimit = billing.hard_limit_usd ?? 0;
  // const softLimit = billing.soft_limit_usd ?? 0
  const hardUs = hardLimit.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const porcentage = Number(
    calcporcentage(hardLimit, totalSemFormato).toLocaleString("en-US", {}),
  );

  return (
    <Card>
      <Title>Cost</Title>
      <Metric>{total}</Metric>
      <DonutChart
        className="mt-6"
        data={sumTotal}
        category={"total"}
        index="name"
        valueFormatter={valueFormatter}
        colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
      />
      <div>
        <Flex>
          <Text>{porcentage}% of hard limit</Text>
          <Text>{hardUs}</Text>
        </Flex>
        <ProgressBar percentageValue={porcentage} className="mt-3" />
      </div>
    </Card>
  );
};


interface DataItem {
   label: string;
   "GPT-4 Turbo": number;
   "GPT-4": number;
   "GPT-3.5 Turbo": number;
   "Assistants API": number;
   "Base models": number;
   "Instruct models": number;
   "Chat models": number;
   "Fine-tuned models": number;
   "Embedding models": number;
   "Image models": number;
   "Audio models": number;
 }

 function convertData(input: DataItem[]): DataItem[] {
   const output: DataItem[] = [];
 
     let totalItem: DataItem = {
     label: "",
     "GPT-4 Turbo": 0,
     "GPT-4": 0,
     "GPT-3.5 Turbo": 0,
     "Assistants API": 0,
     "Fine-tuned models": 0,
     "Embedding models": 0,
     "Base models":0,
     "Image models": 0,
     "Audio models": 0,

     "Instruct models": 0,
     "Chat models": 0,
   };
 
 for (const item of input) {
     totalItem = {
       label: item.label,
       "GPT-4 Turbo": totalItem["GPT-4 Turbo"] + item["GPT-4 Turbo"],
       "GPT-4": totalItem["GPT-4"] + item["GPT-4"],
       "GPT-3.5 Turbo": totalItem["GPT-3.5 Turbo"] + item["GPT-3.5 Turbo"],
       "Assistants API": totalItem["Assistants API"] + item["Assistants API"],
       "Base models": totalItem["Base models"] + item["Base models"],
       "Fine-tuned models": totalItem["Fine-tuned models"] + item["Fine-tuned models"],
       "Embedding models": totalItem["Embedding models"] + item["Embedding models"],
       "Image models": totalItem["Image models"] + item["Image models"],
       "Audio models": totalItem["Audio models"] + item["Audio models"],

       "Instruct models": totalItem["Instruct models"] + item["Instruct models"],
       "Chat models": totalItem["Chat models"] + item["Chat models"],
     };
 
     output.push(totalItem);
   }
   return output;
 }
 

const BarChartz = ({ data, categories, total }:{data: Array<any>, categories: Array<string>, total: string}) => {
  const [typeSelect, setTypeSelect] = useState<string>("2");
  const cumulative = useMemo(() => convertData(data), [])

  return (
    <>
      <Card>
        <Flex>
          <div>
            <Title>Daily Usage (USD)</Title>
            <Metric>{total}</Metric>
          </div>
          <Toggle
            color="zinc"
            defaultValue={typeSelect}
            onValueChange={(value) => setTypeSelect(value.toString())}
          >
            {/* <ToggleItem value="1" text="Minute" /> */}
            <ToggleItem value="2" text="Day" />
            <ToggleItem value="3" text="Cumulative" />
          </Toggle>
        </Flex>
        <div style={{ opacity: 1 }}>
          {typeSelect === "2" && (
            <BarChart
              className="mt-6"
              data={data}
              index="label"
              categories={categories}
              colors={colors}
              valueFormatter={valueFormatter}
              yAxisWidth={58}
              stack
              showLegend={false}
            />
          )}

          {typeSelect === "3" && (
            <AreaChart
              className="mt-6"
              data={cumulative}
              index="label"
              categories={categories}
              colors={colors}
              valueFormatter={valueFormatter}
              showLegend={false}
            />
          )}
        </div>
        <Legend className="mt-3" categories={categories} colors={colors} />
      </Card>
    </>
  );
};

const dataExemplo = [
  {
    name: "Twitter",
    value: 456,
    href: "https://twitter.com/tremorlabs",
    icon: function GoogleIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2.5 fill-blue-500"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
        </svg>
      );
    },
  },
  {
    name: "Google",
    value: 351,
    href: "https://google.com",
    icon: function GoogleIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2.5 fill-slate-500"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49z" />
        </svg>
      );
    },
  },
  {
    name: "GitHub",
    value: 271,
    href: "https://github.com/tremorlabs/tremor",
    icon: function GitHubIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2.5 fill-slate-900"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" />
        </svg>
      );
    },
  },
  {
    name: "Reddit",
    value: 191,
    href: "https://reddit.com",
    icon: function RedditIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2.5 fill-orange-500"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm6.67-10a1.46 1.46 0 0 0-2.47-1 7.12 7.12 0 0 0-3.85-1.23L13 6.65l2.14.45a1 1 0 1 0 .13-.61L12.82 6a.31.31 0 0 0-.37.24l-.74 3.47a7.14 7.14 0 0 0-3.9 1.23 1.46 1.46 0 1 0-1.61 2.39 2.87 2.87 0 0 0 0 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 0 0 0-.44 1.46 1.46 0 0 0 .81-1.33zm-10 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5.81 2.75a3.84 3.84 0 0 1-2.47.77 3.84 3.84 0 0 1-2.47-.77.27.27 0 0 1 .38-.38A3.27 3.27 0 0 0 12 16a3.28 3.28 0 0 0 2.09-.61.28.28 0 1 1 .39.4v-.04zm-.18-1.71a1 1 0 1 1 1-1 1 1 0 0 1-1.01 1.04l.01-.04z" />
        </svg>
      );
    },
  },
  {
    name: "Youtube",
    value: 91,
    href: "https://www.youtube.com/@tremorlabs3079",
    icon: function YouTubeIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2.5 fill-red-500"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
        </svg>
      );
    },
  },
];

function processArray(data: tokens) {
  const result = {};
  const dataOn = ["data", "dalle_api_data", "ft_data", "whisper_api_data"];

  for (const item of Object.entries(data)) {
    const hasData = dataOn.some((key) => {
      return item[0] == key && item[1]?.length > 0;
    });

    if (hasData) {
      for (const tipo of dataOn) {
        for (const subItem of data[tipo]) {
          const key = subItem.snapshot_id
            ? subItem.snapshot_id
            : tipo.replaceAll("_", "-");

          if (!result[key]) {
            result[key] = {
              num_requests: 0,
              n_generated_tokens_total: 0,
              n_context: 0,
              n_context_tokens_total: 0,
              num_images: 0,
              image_size: "",
            };
          }

          result[key].num_requests +=
            subItem.n_requests ?? subItem.num_requests;
          result[key].n_generated_tokens_total +=
            subItem.n_generated_tokens_total ?? 0;
          result[key].n_context += subItem.n_context ?? 0;
          result[key].n_context_tokens_total +=
            subItem.n_context_tokens_total ?? 0;
          result[key].num_images += subItem.num_images ?? 0;
          result[key].image_size += subItem.image_size ?? "";
        }
      }
    }
  }

  return result;
}

const Requests = ({ tokens, keyUse = "num_requests" }) => {
  const requestsTotal = Object.values(tokens).reduce(
    (acc, cur) => acc + cur[keyUse],
    0,
  );
  const dataList = Object.entries(tokens).map(([name, props]) => ({
    name,
    value: props[keyUse] ?? 0,
  }));

  return (
    <>
      <Card>
        <Title>Requests</Title>
        <div>
          <Metric>{requestsTotal ?? 0}</Metric>
          <Text>Total Requests</Text>
        </div>

        <TabList
          defaultValue="1"
          onValueChange={(value) => console.log(value)}
          className="mt-6"
        >
          <Tab value="1" text="Total" icon={UserGroupIcon} />
        </TabList>

        <BarList data={dataList} className="mt-2" />
      </Card>
    </>
  );
};

const Tokens = ({ tokens, keyUse = "n_generated_tokens_total" }) => {
  const tokensTotal = Object.values(tokens).reduce(
    (acc, cur) => acc + cur[keyUse],
    0,
  );

  const dataList = Object.entries(tokens).map(([name, props]) => ({
    name,
    value: props[keyUse] ?? 0,
  }));

  return (
    <Card>
      <Title>Tokens</Title>
      <div>
        <Metric>{tokensTotal ?? 0}</Metric>
        <Text>Total Tokens</Text>
      </div>

      <TabList
        defaultValue="1"
        onValueChange={(value) => console.log(value)}
        className="mt-6"
      >
        <Tab value="1" text="Total" icon={UserGroupIcon} />
      </TabList>

      <BarList data={dataList} className="mt-2" />
    </Card>
  );
};

interface propsDash {
  limits: Billing;
  tokensRequests: tokensRequests[];
  costs: Costs
}
const DashBoardCli = (props: propsDash) => {
  const {
    limits,
    tokensRequests,
  } = props

  if (!props.costs) {
    return (
      <>
        <div className="mx-auto max-w-md text-center">
          <h2 className="font-heading mb-3 text-2xl font-semibold">
            It&rsquo;s a bit empty here
          </h2>
          <p className="mb-7 text-neutral-500">
            something is missing, it was not possible to get the data from the
            api, check that the keys are correct and try again!
          </p>
        </div>
      </>
    );
  }
  const formattedprocess = processArray(tokensRequests);

  const costsNameValue = props.costs.costsList.map(e => {
    const nameAndTotal:any = {
      label: e.label
    }
    e.items.forEach(item => {
      nameAndTotal[item.name] = item.cost / 100
    })

    return(nameAndTotal)
  })


  return (
    <>
      <div className="grid w-full gap-3 px-2 py-2">
        <BarChartz
          data={costsNameValue}
          total={props.costs.totalUsageFormatted}
          categories={props.costs.modelsName}
        />
        <Grid numCols={1} numColsLg={3} className="gap-4">
          <DonutChartw
            data={costsNameValue}
            totalSemFormato={props.costs.totalUsage}
            total={props.costs.totalUsageFormatted}
            billing={limits}
          />

          <Requests tokens={formattedprocess} /> 
          <Tokens tokens={formattedprocess} />
        </Grid>
      </div>
    </>
  );
};

export default DashBoardCli;
