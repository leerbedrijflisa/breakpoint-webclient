﻿using Microsoft.AspNet.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Lisa.Breakpoint.WebClient
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseFileServer();
        }
    }
}