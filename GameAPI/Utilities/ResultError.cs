using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace GameAPI.Utilities
{
    public record ResultError(string Message, HttpStatusCode Type)
    {
        public static readonly ResultError None = new(string.Empty, HttpStatusCode.OK);
        public static ResultError NotFound(string message) => new(message, HttpStatusCode.NotFound);
        public static ResultError Forbidden(string message) => new(message, HttpStatusCode.Forbidden);
        public static ResultError BadRequest(string message) => new(message, HttpStatusCode.BadRequest);
        public static ResultError Conflict(string message) => new(message, HttpStatusCode.Conflict);
    }

    public static class ApiResultExtensions
    {
        public static IActionResult ToActionResult<T>(this Result<T> result, Func<T, bool, IActionResult> onSuccess, Func<ResultError, IActionResult> onFailure)
        {
            return result.IsSuccess ? onSuccess(result.Value!, result.IsCreation) : onFailure(result.Error);
        }

        public static IActionResult ToActionResult(this Result result, Func<IActionResult> onSuccess, Func<ResultError, IActionResult> onFailure)
        {
            return result.IsSuccess ? onSuccess() : onFailure(result.Error);
        }
    }
}