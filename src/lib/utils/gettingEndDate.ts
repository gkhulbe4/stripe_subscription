export function gettingEndDate(endingDate: number) {
  const endDate = new Date(endingDate * 1000); 
  return endDate.toISOString().split("T")[0];
}
