<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Kazi Sasa') }}</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/images/favicon.png">

    <!-- Meta tags for SEO -->
    <meta name="description" content="Find your dream job in Kenya with Kazi Sasa - The leading job portal">
    <meta name="keywords" content="jobs, kenya, employment, career, job search">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- API Base URL -->
    <meta name="api-base-url" content="{{ url('/api/v1') }}">
    <meta name="app-url" content="{{ url('/') }}">

    @vite(['resources/css/app.css', 'resources/src/index.jsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>