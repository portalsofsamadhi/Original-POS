import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { PAGE_SEO } from "../data/seoConfig";

const BookingCancelPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <SEO
        title={PAGE_SEO["/booking-cancel"].title}
        description={PAGE_SEO["/booking-cancel"].description}
        image={PAGE_SEO["/booking-cancel"].image}
        imageAlt={PAGE_SEO["/booking-cancel"].imageAlt}
        url="/booking-cancel"
        noindex
        nofollow
      />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardContent className="pt-6 pb-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-amber-700 mb-2">Payment Cancelled</h1>
              <p className="text-gray-600 mb-6">
                Your booking has not been completed because the payment process was cancelled.
              </p>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => navigate('/experiences')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Return to Retreat Tours
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/book-now')}
                  className="border-green-600 text-green-600"
                >
                  Book an Info Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookingCancelPage;
