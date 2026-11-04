package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "barbero")
public class Barbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBarbero;

    @NotNull
    @NotEmpty
    @Column(name = "nombreCompleto")
    private String nombreCompleto;

    @NotNull
    @Size(min = 10, max = 12)
    @Column(name = "telefono")
    @Pattern(regexp = "^\\d{3}[-\\s]?\\d{3}[-\\s]?\\d{4}$")
    private String telefono;

    @NotNull
    @Email
    @Column(name = "email")
    private String email;

    @NotBlank
    @Column(name = "password")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial")
    private String password;

    @NotNull
    @Column(name = "tipoUsuario")
    private String tipoUsuario;

    @NotNull
    @Column(name = "Experiencia")
    @Min(value = 1)
    private int experiencia;

    @NotNull
    @NotEmpty
    @Column(name = "tituloRol")
    private String tituloRol;

    @Column(name = "sucursal")
    private String sucursal;

    @Lob
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<DisponibilidadBarbero> disponibilidades = new ArrayList<>();

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "barbero")
    private List<ClienteBarbero> clientesBarberos;
}
