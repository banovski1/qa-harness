// C# scaffold: Microsoft.Playwright.NUnit.

import { makeScaffold } from './scaffold.mjs';

export const csharp = makeScaffold({
  id: 'csharp',
  displayName: 'C#',
  extension: '.cs',
  emptyDirs: ['Data/Factories', 'Data/TestData', 'Api/Clients', 'Tests/E2E'],
  layoutNotes: [
    '- `Components/` — reusable component library',
    '- `Pages/` — page objects, composed of components',
    '- `Tests/E2E/` — specs',
  ].join('\n'),
  gettingStarted: 'dotnet build\npwsh bin/Debug/net8.0/playwright.ps1 install chromium\ndotnet test',
  files: (context) => [
    { path: `${pascal(context.config.projectName)}.csproj`, contents: CSPROJ, kind: 'protected' },
    { path: 'Components/BaseComponent.cs', contents: BASE_COMPONENT, kind: 'generated' },
    { path: 'Pages/BasePage.cs', contents: BASE_PAGE, kind: 'generated' },
  ],
});

function pascal(value) {
  return String(value)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
}

const CSPROJ = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Playwright.NUnit" Version="1.49.0" />
    <PackageReference Include="NUnit" Version="4.2.2" />
    <PackageReference Include="NUnit3TestAdapter" Version="4.6.0" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.12.0" />
  </ItemGroup>

</Project>
`;

const BASE_COMPONENT = `using Microsoft.Playwright;

namespace Framework.Components;

/// <summary>
/// Everything a UI component shares: a locator and a readable description.
/// A component never receives the Page, only its own Locator, so it can be
/// re-scoped inside another component without changing its code.
/// </summary>
public abstract class BaseComponent
{
    protected BaseComponent(ILocator locator, string description)
    {
        Locator = locator;
        Description = description;
    }

    public ILocator Locator { get; }

    public string Description { get; }

    public Task WaitForVisibleAsync() =>
        Locator.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible });

    public Task<bool> IsVisibleAsync() => Locator.IsVisibleAsync();

    public Task<bool> IsEnabledAsync() => Locator.IsEnabledAsync();

    public async Task<string> TextAsync() => (await Locator.InnerTextAsync()).Trim();

    public Task ScrollIntoViewAsync() => Locator.ScrollIntoViewIfNeededAsync();
}
`;

const BASE_PAGE = `using Microsoft.Playwright;

namespace Framework.Pages;

/// <summary>
/// Common page-object behaviour: navigation and readiness. Element access
/// belongs in the subclass, so this stays small and stable.
/// </summary>
public abstract class BasePage
{
    protected BasePage(IPage page, string path)
    {
        Page = page;
        Path = path;
    }

    protected IPage Page { get; }

    public string Path { get; }

    /// <summary>Navigate to this page's own path, relative to the configured base URL.</summary>
    public async Task GotoAsync()
    {
        await Page.GotoAsync(Path);
        await WaitUntilReadyAsync();
    }

    /// <summary>
    /// Wait for the page to settle. Load rather than NetworkIdle on purpose: apps
    /// with polling or open sockets never reach network idle and the wait would
    /// hang until the test times out.
    /// </summary>
    public Task WaitUntilReadyAsync() => Page.WaitForLoadStateAsync(LoadState.Load);

    public string Url => Page.Url;
}
`;
