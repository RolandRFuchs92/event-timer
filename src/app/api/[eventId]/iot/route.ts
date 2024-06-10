interface IotGetParams {
  params: {
    eventId: string;
  };
}

export async function GET(req: Request, { params }: IotGetParams) {
  return Response.json({ params });
}
