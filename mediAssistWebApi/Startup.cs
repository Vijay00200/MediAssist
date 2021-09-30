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
                c.Title = "mediAssistWebApi"; c.Version = "v1";
            });

            // services.AddSwaggerGen(c =>
            // {
            //     c.SwaggerDoc("v1", new OpenApiInfo { Title = "mediAssistWebApi", Version = "v1" });
            // });
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
