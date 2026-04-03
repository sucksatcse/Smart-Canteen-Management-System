<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Throwable $exception
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            $statusCode = 500;
            if ($this->isHttpException($exception)) {
                $statusCode = $exception->getStatusCode();
            } elseif ($exception instanceof \Illuminate\Auth\AuthenticationException) {
                $statusCode = 401;
            } elseif ($exception instanceof \Illuminate\Validation\ValidationException) {
                $statusCode = 422;
            } elseif ($exception instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                $statusCode = 404;
            }

            return response()->json([
                'success' => false,
                'message' => $this->getMessage($exception),
            ], $statusCode);
        }

        return parent::render($request, $exception);
    }



    /**
     * Get the error message from the exception.
     *
     * @param \Throwable $exception
     * @return string
     */
    protected function getMessage(Throwable $exception): string
    {
        if ($exception instanceof ValidationException) {
            return 'Validation failed.';
        }

        if ($exception instanceof ModelNotFoundException) {
            return 'Resource not found.';
        }

        return $exception->getMessage() ?: 'An unexpected error occurred.';
    }

}
