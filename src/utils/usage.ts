export function markUsage(key: string) {
  fetch(`/api/usage/${key}`, {
    method: "PUT",
  })
}
