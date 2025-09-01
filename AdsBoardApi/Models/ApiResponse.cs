namespace AdsBoardApi.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public bool ForUser { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

  
        public static ApiResponse<T> Ok(T data, bool forUser = true, string? message = null) =>
            new() { Success = true, ForUser = forUser, Message = message, Data = data };

  
        public static ApiResponse<T> Fail(string message, bool forUser = false) =>
            new() { Success = false, ForUser = forUser, Message = message, Data = default };

     
        public static ApiResponse<T> FromResult(RepoResult<T> result, bool forUser = false) =>
            result.Success
                ? Ok(result.Data!, forUser)
                : Fail(result.Error ?? "שגיאה לא ידועה", forUser);
    }
}
