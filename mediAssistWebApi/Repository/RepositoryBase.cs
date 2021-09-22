using mediassistwebapi.Contracts;
using mediassistwebapi.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace mediassistwebapi.Repository
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : BaseEntity
    {
        protected ApplicationContext RepositoryContext { get; set; }
        public RepositoryBase(ApplicationContext repositoryContext)
        {
            this.RepositoryContext = repositoryContext;
        }
        public IQueryable<T> FindAll()
        {
            return this.RepositoryContext.Set<T>().AsNoTracking();
        }
        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return this.RepositoryContext.Set<T>().Where(expression).AsNoTracking();
        }
        public void Create(T entity)
        {
            this.RepositoryContext.Set<T>().Add(entity);
        }
        public void Update(T entity)
        {
            this.RepositoryContext.Set<T>().Update(entity);
        }
        public void Delete(T entity)
        {
            //change to use soft delete
            // this.RepositoryContext.Set<T>().Remove(entity);
            entity.Deleted = true;
            entity.UpdatedOn = DateTime.Now;
            this.RepositoryContext.Set<T>().Update(entity);

        }
    }
}
