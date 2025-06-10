namespace GameAPI.Utilities
{
    public class Result
    {
        public bool IsSuccess { get; }
        public ResultError Error { get; }
        public bool IsFailure => !IsSuccess;

        protected Result(bool isSuccess, ResultError error)
        {
            IsSuccess = isSuccess;
            Error = error;
        }

        public static Result Success() => new(true, ResultError.None);
        public static Result Failure(ResultError error) => new(false, error);
    }

    public class Result<TValue> : Result
    {
        public TValue? Value { get; }
        public bool IsCreation { get; }

        private Result(TValue? value, bool isSuccess, ResultError error, bool isCreation = false)
            : base(isSuccess, error)
        {
            Value = value;
            IsCreation = isCreation;
        }

        public static Result<TValue> Success(TValue value, bool isCreation = false) => new(value, true, ResultError.None, isCreation);
        public static new Result<TValue> Failure(ResultError error) => new(default, false, error);
    }
}