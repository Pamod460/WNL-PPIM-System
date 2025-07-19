package lk.wnl.wijeya.util.mapper;

import lk.wnl.wijeya.dto.*;
import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.entity.*;
import org.mapstruct.Mapper;

import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ObjectMapper {


    List<CountryDto> toCountryDtoList(List<Country> entities);


    List<DesignationDto> toDesignationDtoList(List<Designation> designations);

    List<EmployeeDto> toEmployeeDtoList(List<Employee> employees);
    EmployeeStatusDto toEmployeeStatusDto(EmployeeStatus employeeStatus);
    List<EmployeeStatusDto> toEmployeeStatusDtoList(List<EmployeeStatus> employeeStatusList);

    List<EmployeeTypeDto> toEmployeeTypeDtoList(List<EmployeeType> employeeTypeList);

    List<GenderDto> toGenderDtoList(List<Gender> genderList);

    List<MaterialCategoryDto> toMaterialCategoryDtoList(List<MaterialCategory> materialCategoryList);

    MaterialCategoryDto toMaterialCategoryDto(MaterialCategory materialcategory);

    List<MaterialDto> toMaterialDtoList(List<Material> materials);

    List<MaterialstatusDto> toMaterialStatusDtoList(List<MaterialStatus> materialStatusList);

    Employee toEmployeeEntity(EmployeeDto employeeDto);

    List<MaterialSubcategoryDto> toMaterialsubcategoryDTOList(List<MaterialSubcategory> materialsubcategoryList);

    List<ModuleDto> toModuleDtoList(List<Module> moduleList);

    List<OperationDto> toOprationDtoList(List<Operation> operationList);

    List<RoleDto> toRoleDtoList(List<Role> roleList);

    List<SupplierStatusDto> toSupplierStatusDtoList(List<SupplierStatus> supplierStatusList);

    List<SupplierTypeDto> toSupplierTypeDtoList(List<SupplierType> supplierTypeList);

    List<UnitTypeDto> toUnitTypeDtoList(List<UserType> userTypeList);

    List<UserStatusDto> toUserStatusDtoList(List<UserType> userTypeList);

    Material toMaterial(MaterialDto materialDto);

    Privilege toPrivilage(PrivilegeDto privilegeDto);

    User toUser(UserDto userDto);

    List<UserDto> toUserDtoList(List<User> userList);

    Collection<UserRoleDto> toUserRoleDto(Collection<UserRole> userRoles);

    EmployeeDto toEmployeeDto(Employee employee);

    UserStatus toUseStatus(UserStatusDto inactive);

    Supplier toSupplier(SupplierDto supplierDto);

    List<SupplierDto> toSupplierDtoList(List<Supplier> supplierList);

    List<ProductCategoryDto> toProductTypeDtoList(List<ProductCategory> productCategoryList);

    List<ProductFrequencyDto> toProductFrequencyDtoList(List<ProductFrequency> productFrequencyList);

    List<ProductStatusDto> toProductStatusDtoList(List<ProductStatus> productStatusList);

    List<ProductDto> toProductDtoList(List<Product> products);

    Product toProduct(ProductDto productDto);

    ProductDto toProductDto(Product product);

    Paper toPaper(PaperDto paperDto);

    List<PaperDto> toPaperDtoList(List<Paper> papers);

    List<PaperColorDto> toPaperColorDtoList(List<PaperColor> paperColors);

    List<PaperGsmDto> toPaperGsmDtoList(List<PaperGsm> paperGsms);

    List<PaperStatusDto> toPaperStatusDtoList(List<PaperStatus> paperStatuses);

    List<PaperSizeDto> toPaperSizeDtoList(List<PaperSize> paperSizes);

    List<PaperTypeDto> toPaperTypeDtoList(List<PaperType> paperTypes);

    List<PaperUnitTypeDto> toPaperUnitTypeDtoList(List<PaperUnitType> paperUnitTypes);


   

    List<DistrictDto> toDistrictDtoList(List<District> districtList);

    List<AgentStatusDto> toAgentStatusDtoList(List<AgentStatus> agentStatusList);

    List<RouteDto> toRouteDtoList(List<Route> routeList);

    List<AgentDto> toAgentDtoList(List<Agent> agentList);

    Agent toAgentEntity(AgentDto agentDto);

    DistrictDto toDistrictDto(District district);

    AgentStatusDto toAgentStatusDto(AgentStatus agentStatus);

    RouteDto toRouteDto(Route route);

    UserDto toUserDto(User createdBy);

    Object toAgentDto(Agent savedAgent);

    Vehicle vehicleDtoToVehicle(VehicleDto vehicleDTO);

    List<VehicleDto> vehicleListToDtoList(List<Vehicle> vehicles);

    List<VehicleModelDto> vehicleModelListToDtoList(List<VehicleModel> vehicleModelList);

    List<VehicleStatusDto> vehicleStatusListToDtoList(List<VehicleStatus> vehiclestatuses);

    List<VehicleTypeDto> vehicleTypeListToDtoList(List<VehicleType> vehicletypes);

    List<RouteStatusDto> toRouteStatusDto(List<RouteStatus> routeStatuses);

    Route toRoute(RouteDto routeDto);

    List<MaterialPorderStatusDto> toMaterialPoderStatusDtoList(List<MaterialPorderStatus> materialPorderStatuses);

    List<MaterialPorderDto> toMaterialPoderDtoList(List<MaterialPorder> materialPorders);

    MaterialPorder toMaterialPoder(MaterialPorderDto materialPorderDto);

    List<PaperPorderStatusDto> toPaperPoderStatusDtoList(List<PaperPorderStatus> all);

    List<PaperPorderDto> toPaperPoderDtoList(List<PaperPorder> all);

    PaperPorder toPaperPoder(PaperPorderDto paperPorderDto);

    List<MaterialGrnDto> toMaterialGrnDtoList(List<MaterialGrn> all);

    MaterialGrn toMaterialGrn(MaterialGrnDto materialGrnDto);

    List<PaperGrnDto> toPaperGrnDtoList(List<PaperGrn> all);

    PaperGrn toPaperGrn(PaperGrnDto paperGrnDto);

    List<SupplierPaymentDto> tosupplierPaymentDtoList(List<SupplierPayment> supplierPayments);

    List<SupplierPaymentDto> toSupplierPaymentDtoList(List<SupplierPayment> collect);

    SupplierPayment toSupplierPayment(SupplierPaymentDto supplierPaymentDto);

    List<PaymentTypeDto> paymentTypesToDtoList(List<PaymentType> paymentTypes);

    List<PaymentStatusDto> paymentStatusesToDtoList(List<PaymentStatus> paymentStatuses);

    List<GrnTypeDto> grnTypesToDtoList(List<GrnType> grnTypes);

    List<PaperGrnStatusDto> toPaperGrnStatusDtoList(List<PaperGrnStatus> all);

    List<MaterialGrnStatusDto> toMaterialGrnStatusDtoList(List<MaterialGrnStatus> all);


    List<ProductDesignDto> toProductDesignsDtoList(List<ProductDesign> productDesigns);

    ProductDesign toProductDesign(ProductDesignDto productDesignDto);

    List<ProductDesignStatusDto> toProductDesignStatusDtoList(List<ProductDesignStatus> productDesignStatuses);

    List<ProductionOrderDto> toProductOrdersDtoList(List<ProductionOrder> productionOrders);

    ProductionOrder toProductionOrder(ProductionOrderDto productionOrderDto);

    List<ProductionOrderStatusDto> toProductionOrderStatusDtoList(List<ProductionOrderStatus> productionOrderStatuses);

    List<MaterialIssueDto> toMaterialIssueDtoList(List<MaterialIssue> all);

    MaterialIssue toMaterialIssue(MaterialIssueDto materialIssueDto);

    List<PaperIssueDto> toPaperIssueDtoList(List<PaperIssue> all);

    PaperIssue toPaperIssue(PaperIssueDto paperIssueDto);

    List<AgentOrderDto> toAgentOrderDtoList(List<AgentOrder> all);

    AgentOrder toAgentOrder(AgentOrderDto agentOrderDto);

    List<AgentOrderStatusDto> toAgentOrderStatusDtoList(List<AgentOrderStatus> agentOrderStatusList);

    List<AgentPaymentTypeDto> toPaymentTypeDtoList(List<AgentPaymentType> paymentTypeList);

    List<BankDto> toBankDtoList(List<Bank> bankList);



    List<AgentPaymentDto> toAgentPaymentDtoList(List<AgentPayment> agentPaymentPayment);

    AgentPayment toAgentPayment(AgentPaymentDto agentPaymentDto);

    List<DistributionStatusDto> toDistributionStatusDtoList(List<DistributionStatus> distributionStatusList);

    List<DistributionDto> toDistributionDtoList(List<Distribution> distributionList);

    Distribution toDistributionList(DistributionDto distributionDto);

    List<CheqStatusDto> toCheqStatusDtoList(List<CheqStatus> cheqStatusList);
}
