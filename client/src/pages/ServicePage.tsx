
import React from "react";
import { useRoute, Link } from "wouter";
import { services, businesses } from "@/lib/data";
// import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, MapPin, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ServicePage() {
  const [match, params] = useRoute("/usluga/:slug");
  
  if (!match) return null;

  const service = services.find(s => s.slug === params.slug);
  
  if (!service) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Usluga nije pronađena</h1>
        <Link href="/">
          <Button>Povratak na naslovnicu</Button>
        </Link>
      </div>
    );
  }

  const serviceBusinesses = businesses.filter(b => b.category_id === service.id);

  return (
    <div className="animate-in fade-in duration-500">
      {/* SEO Meta Tags (Simulated) */}
      {/* SEO Meta Tags are handled by the document head or a proper SEO component in a real app */}
      {/* <title>{`${service.title} Split - Najbolji ${service.title} u Splitu | Cijene i Iskustva`}</title> */}
      {/* <meta name="description" content={`Tražite pouzdanog ${service.title.toLowerCase()}a u Splitu? ${service.description} Pronađite provjerene stručnjake, usporedite cijene i pročitajte recenzije.`} /> */}
      
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={service.image} 
          alt={service.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
           <Badge variant="secondary" className="mb-4 uppercase tracking-widest text-xs font-bold bg-primary text-primary-foreground border-none px-3 py-1">
              Lokalne Usluge Split
           </Badge>
           <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-lg uppercase tracking-tight">
              {service.title} <span className="text-secondary">Split</span>
           </h1>
           <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light leading-relaxed drop-shadow-md">
              {service.description}
           </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
         <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Natrag na sve usluge
         </Link>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content List */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                     Preporučeni {service.title} ({serviceBusinesses.length})
                  </h2>
                  <div className="text-sm text-muted-foreground">
                     Sortiraj po: <span className="font-medium text-foreground cursor-pointer">Najbolje ocjene</span>
                  </div>
               </div>

               <div className="space-y-6">
                  {serviceBusinesses.length > 0 ? (
                     serviceBusinesses.map((business) => (
                        <Card key={business.id} className="overflow-hidden hover:shadow-md transition-shadow border-border/60 bg-card/50 backdrop-blur-sm">
                           <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-48 h-48 sm:h-auto bg-muted relative">
                                 {/* Placeholder for business image */}
                                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/10">
                                    <service.icon className="h-12 w-12 opacity-20" />
                                 </div>
                              </div>
                              <div className="flex-1 p-6 flex flex-col justify-between">
                                 <div>
                                    <div className="flex justify-between items-start mb-2">
                                       <h3 className="text-xl font-bold font-display uppercase tracking-tight">{business.name}</h3>
                                       <Badge variant="outline" className="flex items-center gap-1 border-primary/20 bg-primary/5 text-primary">
                                          <Star className="h-3 w-3 fill-current" />
                                          {business.rating}
                                       </Badge>
                                    </div>
                                    <div className="flex items-center text-muted-foreground mb-4 text-sm">
                                       <MapPin className="h-4 w-4 mr-1 text-secondary" />
                                       {business.address}
                                    </div>
                                    <div className="flex gap-2 flex-wrap mb-4">
                                       {["Brza usluga", "Provjereno", "Garancija"].map((tag, i) => (
                                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                             {tag}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="flex gap-3 mt-4 sm:mt-0">
                                    <Button className="flex-1 gap-2 font-semibold uppercase tracking-wide text-xs h-10">
                                       <Phone className="h-4 w-4" />
                                       Nazovi
                                    </Button>
                                    <Button variant="outline" className="flex-1 font-semibold uppercase tracking-wide text-xs h-10 border-border hover:bg-muted">
                                       Detalji
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </Card>
                     ))
                  ) : (
                     <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-border">
                        <p className="text-muted-foreground">Trenutno nemamo istaknutih pružatelja ove usluge.</p>
                        <Button variant="link" className="mt-2 text-primary">Postani prvi partner</Button>
                     </div>
                  )}
               </div>

               {/* SEO Content Section */}
               <div className="mt-16 prose prose-slate max-w-none">
                  <h3 className="font-display font-bold text-2xl mb-4">
                     Zašto odabrati provjerene {service.title.toLowerCase()} u Splitu?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                     Kada tražite <strong>{service.keywords[0]}</strong>, važno je pronaći stručnjake koji poznaju specifičnosti splitskih instalacija i gradnje. 
                     Naši partneri nude vrhunsku uslugu na području cijelog Splita, od centra grada i Dioklecijanove palače do novijih kvartova poput Splita 3, Mertojaka i Žnjana.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                     {[
                        "Hitne intervencije 0-24h",
                        "Transparentne cijene bez skrivenih troškova",
                        "Višegodišnje iskustvo rada u Splitu",
                        "Garancija na izvedene radove"
                     ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                           <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                           <span className="text-sm font-medium">{item}</span>
                        </div>
                     ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                     Bez obzira trebate li hitnu intervenciju ili planirani zahvat, naši <strong>{service.title.toLowerCase()}</strong> su vam na raspolaganju. 
                     Pregledajte ocjene drugih korisnika i odaberite najbolju uslugu za svoje potrebe.
                  </p>
               </div>
            </div>

            {/* Sidebar / CTA */}
            <div className="space-y-8">
               <Card className="bg-primary text-primary-foreground border-none shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
                  
                  <CardHeader>
                     <CardTitle className="font-display uppercase tracking-wide">Trebate hitnu pomoć?</CardTitle>
                     <CardDescription className="text-primary-foreground/80">
                        Pronađite dostupne stručnjake odmah.
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <p className="mb-6 text-sm opacity-90">
                        Naša mreža pokriva sve kvartove u Splitu. Nazovite direktno ili zatražite ponudu.
                     </p>
                     <Button variant="secondary" className="w-full font-bold uppercase tracking-wider">
                        Zatraži ponudu
                     </Button>
                  </CardContent>
               </Card>

               <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <h4 className="font-display font-bold uppercase text-sm mb-4 text-muted-foreground">Popularne pretrage</h4>
                  <div className="flex flex-wrap gap-2">
                     {service.keywords.map((keyword, i) => (
                        <Link key={i} href="#">
                           <Badge variant="outline" className="cursor-pointer hover:bg-background transition-colors font-normal text-muted-foreground">
                              {keyword}
                           </Badge>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
