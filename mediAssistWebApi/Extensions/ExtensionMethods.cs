
using mediassistwebapi.Contracts;
using mediassistwebapi.Entities;
using mediassistwebapi.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace mediassistwebapi.Extensions
{
    public static class ExtensionMethods
    {
        /// <summary>
        /// Extension Method to apply hasQueryFilter on all the entity
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="modelBuilder"></param>
        /// <param name="expression"></param>
        public static void ApplyGlobalFilters<T>(this ModelBuilder modelBuilder, Expression<Func<T, bool>> expression) where T : class
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                //if(entityType.ClrType.GetInterface(typeof(T).Name)!=null)
                if (!typeof(T).IsAssignableFrom(entityType.ClrType))
                {
                    var newParam = Expression.Parameter(entityType.ClrType);
                    var newBody = ReplacingExpressionVisitor
                                    .Replace(expression.Parameters.Single(), newParam, expression.Body);
                    modelBuilder.Entity(entityType.ClrType)
                                .HasQueryFilter(Expression.Lambda(newBody, newParam));

                }
            }
        }

        /// <summary>
        /// Configure the Repository Wrapper
        /// </summary>
        /// <param name="services"></param>
        public static void ConfigureRepositoryWrapper(this IServiceCollection services)
        {
            services.AddScoped<IRepositoryWrapper, RepositoryWrapper>();
        }

        public static void ConfigureJWTAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Jwt:ValidIssuer"], //"https://mediassistapi.vksolutions.site",
                    ValidAudience = configuration["Jwt:ValidAudience"], //"https://mediassist.vksolutions.site",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]))
                };
            });

        }

        public static void ConfigureCORS(this IServiceCollection services, IConfiguration configuration)
        {
            // services.AddCors(options =>
            //     {
            //         options.AddDefaultPolicy(
            //             builder =>
            //             {
            //                 builder.WithOrigins(configuration["Jwt:ValidAudience"])
            //                         .AllowAnyHeader()
            //                         .AllowAnyMethod();
            //             });
            //     });

            services.AddCors(options =>
            {
                options.AddPolicy("Policy1", builder =>
                {
                    builder.WithOrigins(configuration["Jwt:ValidAudience"])
                                                        .AllowAnyHeader()
                                                        .AllowAnyMethod()
                                                        .AllowCredentials();
                });
            });
        }


        /// <summary>
        /// To auto configuret the database migration on application start
        /// </summary>
        /// <param name="host"></param>
        /// <returns></returns>
        public static IHost MigrateDatabase(this IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                using (var appContext = scope.ServiceProvider.GetRequiredService<ApplicationContext>())
                {
                    try
                    {
                        appContext.Database.Migrate();
                    }
                    catch (Exception ex)
                    {
                        //Log errors or do anything you think it's needed
                        throw ex;
                    }
                }
            }
            return host;

        }
    }
}