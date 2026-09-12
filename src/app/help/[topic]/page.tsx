import {notFound,redirect} from "next/navigation"
const routes:Record<string,string>={contact:"/contact",shipping:"/shipping",returns:"/returns",faq:"/faq"}
export function generateStaticParams(){return Object.keys(routes).map(topic=>({topic}))}
export default async function LegacyHelpPage({params}:PageProps<"/help/[topic]">){const {topic}=await params,target=routes[topic];if(!target)notFound();redirect(target)}
