namespace DailyTask.Server.Servicos.Autenticacao
{
	using DailyTask.Server.Dominio;
	using DailyTask.Server.Dto.Autenticacao;
	using Microsoft.AspNetCore.Identity;
	using System;
	using System.Threading.Tasks;

	public class AutenticacaoService : IAutenticacaoService
	{
		private readonly UserManager<Usuario> _userManager;

		public AutenticacaoService(UserManager<Usuario> userManager)
		{
			_userManager = userManager;
		}

		public async Task<bool> Autenticar(AutenticarDto autenticarDto)
		{
			
		}
	}
}