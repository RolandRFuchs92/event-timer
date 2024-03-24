"use server";

export async function createNewEntry(data: any) {
  console.log(data);
  return {
    message: "Success!",
    data,
  };
}
