namespace AdsBoardApi.Models
{
    public class RepoResult<T>
    {
        public bool Success { get; init; }
        public string? Error { get; init; }
        public T? Data { get; init; }

        public static RepoResult<T> Ok(T? data = default) => new() { Success = true, Data = data };
        public static RepoResult<T> Fail(string error) => new() { Success = false, Error = error };
    }
}
