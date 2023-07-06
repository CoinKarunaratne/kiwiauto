import BusinessForm from "./businessForm";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="space-y-3">
      <BusinessForm slug={params.id} />
    </div>
  );
};

export default page;
