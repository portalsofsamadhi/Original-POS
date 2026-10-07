
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Clock, DollarSign } from "lucide-react";
import OptimizedImage from "../ui/OptimizedImage";

interface ServiceCardProps {
  title: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
  onBookNow?: () => void;
}

const ServiceCard = ({
  title = "Spiritual Guidance Session",
  description = "A one-on-one session to explore your spiritual journey and receive personalized guidance.",
  duration = "60 minutes",
  price = 120,
  image = "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80",
  onBookNow = () => console.log("Book now clicked"),
}: ServiceCardProps) => {
  return (
    <Card className="w-[350px] h-[250px] overflow-hidden flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-24 overflow-hidden">
        {image && (
          <OptimizedImage 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-2">
          {description}
        </CardDescription>
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>${price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onBookNow}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
