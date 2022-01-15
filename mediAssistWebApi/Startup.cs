using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using mediassistwebapi.Entities;
using mediassistwebapi.Extensions;
using mediassistwebapi.Contracts;
using mediassistwebapi.Util;
using System.Collections.Generic;
using NSwag.Generation.Processors.Security;
using System.Linq;
using NSwag;

namespace mediAssistWebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.ConfigureCORS(Configuration);

            services.AddDbContext<ApplicationContext>(opts =>
                    opts.UseSqlServer(Configuration.GetConnectionString("sqlConnection")));

            services.ConfigureRepositoryWrapper();

            services.AddAutoMapper(typeof(Startup));

            services.ConfigureJWTAuthentication(Configuration);

            services.AddTransient<ITokenService, TokenService>();

            services.AddControllers();

            // Register the Swagger services
            services.AddSwaggerDocument(c =>
            {
                c.Title = "mediAssistWebApi";
                c.Version = "v1";
                c.OperationProcessors.Add(new OperationSecurityScopeProcessor("JWT Token"));
                c.AddSecurity("JWT Token", Enumerable.Empty<string>(),
                    new NSwag.OpenApiSecurityScheme()
                    {
                        Type = OpenApiSecuritySchemeType.ApiKey,
                        Name = "Authorization",
                        In = OpenApiSecurityApiKeyLocation.Header,
                        Description = "Copy this into the value field: Bearer {token}"
                    }
                );

            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseOpenApi();
                app.UseSwaggerUi3();
                // app.UseSwagger();
                // app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "mediAssistWebApi v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("Policy1");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
