import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePageCarousel() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>


            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                <div className="p-2 sm:p-4">
                  <Card>
                    <CardContent className="flex h-40 sm:h-52 md:h-60 items-center justify-center relative rounded overflow-hidden p-0">
                      <Image
                        src="/shopsy.PNG"
                        alt="image"
                        fill
                        className="object-cover "
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

            ))}
          </CarouselContent>
          
          <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 z-20 pointer-events-none">
            <CarouselPrevious className="relative pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 opacity-80 hover:opacity-100" />
            <CarouselNext className="relative pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 opacity-80 hover:opacity-100" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}



