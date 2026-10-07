export interface BookNowParams {
  serviceName: string;
  serviceDuration: string;
  servicePrice: number;
  practitionerName: string;
  serviceId?: string;
}

export const buildBookNowUrl = ({
  serviceName,
  serviceDuration,
  servicePrice,
  practitionerName,
  serviceId,
}: BookNowParams) => {
  const params = new URLSearchParams({
    serviceName,
    serviceDuration,
    servicePrice: servicePrice.toString(),
    practitionerName,
  });
  if (serviceId) params.set("serviceId", serviceId);
  return `/book-now?${params.toString()}`;
};

export const buildJourneyStoryUrl = (storyId: string) => `/about/journey/${storyId}`;

export const buildJourneyPhotoUrl = (src: string, alt: string) => {
  const params = new URLSearchParams({
    src,
    alt,
  });
  return `/about/journey/photo?${params.toString()}`;
};

export const buildShortPreviewUrl = (shortId: string) => `/preview/${shortId}`;