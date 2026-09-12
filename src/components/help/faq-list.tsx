"use client"
import Link from "next/link"
import {Accordion,AccordionContent,AccordionItem,AccordionTrigger} from "@/components/ui/accordion"
import {faqItems} from "@/data/help"
const categories=[...new Set(faqItems.map(x=>x.category))]
export function FAQList(){return <div>{categories.map(category=><section key={category} id={category.toLowerCase()} className="scroll-mt-28 border-t py-10"><h2 className="font-display text-4xl text-primary">{category}</h2><Accordion type="multiple" className="mt-5">{faqItems.filter(x=>x.category===category).map(item=><AccordionItem key={item.id} value={item.id} id={item.id} className="scroll-mt-28"><AccordionTrigger className="py-5 text-base">{item.question}</AccordionTrigger><AccordionContent className="pb-5 leading-7 text-muted-foreground"><p>{item.answer}</p>{item.href&&<Link href={item.href} className="mt-3 inline-block font-semibold text-primary">Learn more →</Link>}</AccordionContent></AccordionItem>)}</Accordion></section>)}</div>}
